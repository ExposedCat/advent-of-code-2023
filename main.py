import re


def parse(filepath: str):
    with open(filepath) as file:
        seeds = list(map(int, re.findall(r'\d+', file.readline())))

        steps = []
        for block in file.read().split('\n\n'):
            block = block.split('\n')
            while '' in block:
                block.remove('')
            nums = []
            for item in block[1:]:
                nums.append(list(map(int,item.split(' '))))
            steps.append(nums)
        return seeds, steps
            

def process(step, seed):
    for nums in step:
        if seed >= nums[1] and seed < nums[2]+nums[1]:
            return seed - (nums[1]-nums[0])
    return seed



if __name__ == '__main__':
    seeds, steps = parse("input.txt")
    seeds = [seeds[i:i + 2] for i in range(0, len(seeds), 2)]  

    result = []
    for seed in seeds:
        print(seed)
        for i in range(seed[0], seed[0]+seed[1]):
            k = i
            for step in steps:
                k = process(step, k)
            result.append(k)

    print(min(result))